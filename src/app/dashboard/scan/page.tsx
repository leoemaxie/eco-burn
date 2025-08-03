import { ComponentScanner } from '@/components/component-scanner';
import { PageHeader } from '@/components/page-header';

export default function ScanPage() {
  return (
    <>
      <PageHeader
        title="Component Scanner"
        description="Identify electronic components using your device's camera."
      />
      <div className="flex justify-center">
        <ComponentScanner />
      </div>
    </>
  );
}
