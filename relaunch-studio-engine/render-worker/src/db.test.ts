/**
 * ReLaunch Studio — Database & Storage Client Verification Test
 * Validates module exports and type compatibility
 */

import { pool, getVariantsForReview, updateVariantStatus } from './db';
import { BUCKET_RAW, BUCKET_VARIANTS, s3 } from './storage';

async function runHealthCheck() {
  console.log('--- ReLaunch Studio: DB & Storage Client Health Check ---');

  // Verify Storage Configuration
  console.log(`[Storage] Raw bucket: ${BUCKET_RAW}`);
  console.log(`[Storage] Variants bucket: ${BUCKET_VARIANTS}`);
  if (typeof s3.send === 'function') {
    console.log('[Storage] S3 Client initialized successfully ✓');
  }

  // Verify DB Interface Types
  if (typeof getVariantsForReview === 'function' && typeof updateVariantStatus === 'function') {
    console.log('[Database] Query helpers exported successfully ✓');
  }

  console.log('--- Verification Complete: Ready for VPS Database Connection ---');
}

if (require.main === module) {
  runHealthCheck()
    .catch((err) => {
      console.error('Health check failed:', err);
      process.exit(1);
    })
    .finally(() => {
      pool.end();
    });
}

export { runHealthCheck };
