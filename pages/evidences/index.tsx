import { Button, Group } from '@mantine/core';
import { useRouter } from 'next/navigation';

export default function EvidencesPage() {
  const router = useRouter()
  // FIXME: This is a placeholder for the actual evidenceId
  const evidenceId = "https://tradex-promo-app-v1-dev.s3.amazonaws.com/media/evidences/baruel/2025_02_05_testing_001.webp"

  return (
    <Group mt={50} justify="center">
      <Button size="xl" onClick={() => router.push(`/evidences/${encodeURIComponent(evidenceId)}`)}>See details</Button>
    </Group>
  );
}