import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { SegmentedControl, Stack } from '@mantine/core';
import { ImageWithBoundingBoxes } from '@/components/ImageWithBoundingBoxes';
import { RenderIf } from '@/components/RenderIf';
import { isValidUrl } from '@/utils/isValidURL';

type APIResult = {
  api_result: {
    predict: any[]
  }
}

type AIResult = {
  detectorResult: APIResult;
  priceResult: APIResult;
  classifierResult: APIResult;
}

type AIApi = keyof AIResult

const emptyDefaultAPIResult = {
  api_result: {
    predict: []
  }
}

export default function EvidenceDetails() {
  const router = useRouter()
  const { evidenceId } = router.query
  const [data, setData] = useState<AIResult>({
    detectorResult: emptyDefaultAPIResult,
    priceResult: emptyDefaultAPIResult,
    classifierResult: emptyDefaultAPIResult
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof evidenceId !== 'string') return

    fetch(`/api/evidences/${encodeURIComponent(evidenceId)}`)
      .then((response) => response.json())
      .then((data) => {
        console.log({ data })
        setData(data);
        setLoading(false);
      });
  }, [evidenceId]);

  const [selectedApi, setSelectedApi] = useState<AIApi>('detectorResult');

  // TODO: Render default page if evidenceId is not a string
  if (typeof evidenceId !== 'string') return null;
  if (loading) return <p>Loading...</p>;

  return (
    <Stack align="center">
      <SegmentedControl
        data={[{
          value: 'detectorResult',
          label: 'Detector Results'
        }, {
          value: 'priceResult',
          label: 'Price Results'
        }, {
          value: 'classifierResult',
          label: 'Classifier Results'
        }]}
        value={selectedApi}
        onChange={(value) => setSelectedApi(value as AIApi)} />
      <RenderIf condition={isValidUrl(evidenceId)}>
        <ImageWithBoundingBoxes
          imageUrl={evidenceId}
          boxes={
            data[selectedApi].api_result.predict.map(({ coords, ...props }) =>
              ({ minX: coords[0], minY: coords[1], maxX: coords[2], maxY: coords[3], description: props })
            )
          } />
      </RenderIf>
    </Stack>
  );
}