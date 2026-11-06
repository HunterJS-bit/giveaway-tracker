export default defineNuxtPlugin(async () => {
  const { fetchCategories } = useCategories();

  // Fetch before the app renders so the footer and filters hydrate with the
  // same category list on the server and the client.
  await fetchCategories();
});
