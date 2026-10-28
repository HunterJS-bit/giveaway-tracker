// Security middleware to block reconnaissance requests
export default defineEventHandler((event) => {
  const path = event.node.req.url || '';

  // Block common reconnaissance paths
  const blockedPatterns = [
    '/internal/',
    '/.env',
    '/env',
    '/config',
    '/secrets',
    '/latest/meta-data',
    '/actuator',
    '/admin',
    '/wp-admin',
    '/phpmyadmin',
    '/.git',
    '/.svn',
  ];

  const isBlocked = blockedPatterns.some(pattern => path.startsWith(pattern));

  if (isBlocked) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'Access denied',
    });
  }
});
