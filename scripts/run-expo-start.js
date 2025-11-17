#!/usr/bin/env node

/**
 * Expo's dev server needs to bind to a TCP port. Sandbox environments (like CI or
 * interactive coding sandboxes) often forbid opening listening sockets, which
 * causes `expo start` to crash before it can even print a helpful message.
 *
 * This helper probes whether we can bind to an ephemeral loopback port. If the
 * probe fails with `EPERM`/`EACCES`, we report a friendly warning and exit
 * gracefully so `npm start` does not hard-crash in restricted environments.
 * On a normal workstation the probe succeeds and we delegate to `expo start`.
 */

const path = require('path');
const net = require('net');
const { spawn } = require('child_process');

function probeLoopbackPort() {
  return new Promise((resolve) => {
    const server = net.createServer();
    const done = (result) => {
      server.removeAllListeners();
      try {
        server.close(() => resolve(result));
      } catch {
        resolve(result);
      }
    };

    server.once('error', (error) => {
      done({ ok: false, error });
    });

    server.listen({ port: 0, host: '127.0.0.1' }, () => {
      done({ ok: true });
    });
  });
}

async function run() {
  const probe = await probeLoopbackPort();
  if (!probe.ok) {
    console.warn('⚠️  Expo dev server requires permission to bind to a local TCP port.');
    console.warn('    The current environment blocked the probe (`npm start` is running in a sandbox).');
    console.warn('    Error:', probe.error?.message || probe.error);
    console.warn('    Please run `npm start` on your local machine where ports can be opened.');
    process.exit(0);
  }

  const expoBin = path.join(
    __dirname,
    '..',
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'expo.cmd' : 'expo'
  );

  const child = spawn(expoBin, ['start'], {
    stdio: 'inherit',
    env: process.env,
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });

  child.on('error', (error) => {
    console.error('Failed to launch Expo CLI:', error.message);
    process.exit(1);
  });
}

run();
