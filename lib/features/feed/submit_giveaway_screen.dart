import 'package:flutter/material.dart';
import '../../core/services/api_service.dart';

class SubmitGiveawayScreen extends StatefulWidget {
  const SubmitGiveawayScreen({super.key});

  @override
  State<SubmitGiveawayScreen> createState() => _SubmitGiveawayScreenState();
}

class _SubmitGiveawayScreenState extends State<SubmitGiveawayScreen> {
  final _formKey = GlobalKey<FormState>();
  final _urlController = TextEditingController();
  bool _isSubmitting = false;

  @override
  void dispose() {
    _urlController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    try {
      await ApiService.submitGiveaway(_urlController.text.trim());
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Hvala! Nagradna igra je poslata na verifikaciju.'),
          backgroundColor: Colors.green,
        ),
      );
      Navigator.of(context).pop();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Greška: $e'), backgroundColor: Colors.red),
      );
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Predloži nagradnu igru'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Pronašli ste nagradnu igru koju mi nemamo? Nalepite link ispod i mi ćemo je proveriti!',
                style: TextStyle(fontSize: 16),
              ),
              const SizedBox(height: 24),
              TextFormField(
                controller: _urlController,
                decoration: InputDecoration(
                  labelText: 'URL nagradne igre',
                  hintText: 'https://instagram.com/p/...',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  prefixIcon: const Icon(Icons.link),
                ),
                keyboardType: TextInputType.url,
                autofocus: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Molimo unesite URL';
                  }
                  if (!value.startsWith('http')) {
                    return 'URL mora početi sa http ili https';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: _isSubmitting ? null : _submit,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: _isSubmitting
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Text(
                        'POŠALJI NA PROVERU',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
              ),
              const Spacer(),
              const Opacity(
                opacity: 0.6,
                child: Text(
                  'Napomena: Objavljujemo samo proverene nagradne igre koje su u skladu sa našim pravilima.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 12),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
