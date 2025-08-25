/* eslint-disable react-hooks/rules-of-hooks */
import { Stack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { settingStyles } from './setting-styles';
import { useLive2dSettings } from '@/hooks/sidebar/setting/use-live2d-settings';
import { SwitchField } from './common';

interface Live2DProps {
  onSave?: (callback: () => void) => () => void
  onCancel?: (callback: () => void) => () => void
}

function Live2DSetting({ onSave, onCancel }: Live2DProps): JSX.Element {
  const {
    modelInfo,
    handleInputChange,
    handleSave,
    handleCancel,
  } = useLive2dSettings();

  useEffect(() => {
    if (!onSave || !onCancel) return;

    const cleanupSave = onSave(handleSave);
    const cleanupCancel = onCancel(handleCancel);

    return (): void => {
      cleanupSave?.();
      cleanupCancel?.();
    };
  }, [onSave, onCancel]);

  // Remove any usage or settings related to Cubism2 here by not rendering any UI for it

  return (
    <Stack {...settingStyles.common.container}>
      <SwitchField
        label="Pointer Interactive"
        checked={modelInfo.pointerInteractive ?? false}
        onChange={(checked) => handleInputChange('pointerInteractive', checked)}
      />

      <SwitchField
        label="Enable Scroll to Resize"
        checked={modelInfo.scrollToResize ?? true}
        onChange={(checked) => handleInputChange('scrollToResize', checked)}
      />
    </Stack>
  );
}

export default Live2DSetting;
