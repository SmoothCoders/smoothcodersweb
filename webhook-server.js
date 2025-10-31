const http = require('http');
const { exec } = require('child_process');
const crypto = require('crypto');

const PORT = 9000;
const SECRET = 'your-webhook-secret-here'; // Change this!
const DEPLOY_SCRIPT = '/home/smoothcoders/htdocs/smoothcoders.com/deploy.sh';

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/deploy') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        // Verify GitHub signature
        const signature = req.headers['x-hub-signature-256'];
        if (signature) {
          const hash = crypto
            .createHmac('sha256', SECRET)
            .update(body)
            .digest('hex');
          const expectedSignature = `sha256=${hash}`;

          if (signature !== expectedSignature) {
            res.writeHead(401);
            res.end('Invalid signature');
            return;
          }
        }

        const payload = JSON.parse(body);
        
        // Check if it's a push to main branch
        if (payload.ref === 'refs/heads/main') {
          console.log('🚀 Deployment triggered by:', payload.pusher.name);
          
          // Execute deployment script
          exec(`bash ${DEPLOY_SCRIPT}`, (error, stdout, stderr) => {
            if (error) {
              console.error('❌ Deployment failed:', error);
              return;
            }
            console.log('✅ Deployment output:', stdout);
            if (stderr) console.error('⚠️  Deployment warnings:', stderr);
          });

          res.writeHead(200);
          res.end('Deployment started');
        } else {
          res.writeHead(200);
          res.end('Not main branch, skipping deployment');
        }
      } catch (error) {
        console.error('Error processing webhook:', error);
        res.writeHead(500);
        res.end('Error processing webhook');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`🎣 Webhook server listening on port ${PORT}`);
  console.log(`📍 Endpoint: http://your-server-ip:${PORT}/deploy`);
});
