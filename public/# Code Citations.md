# Code Citations

## License: 不明
https://github.com/yeemachine/kalidoface-next/tree/25f51c47f41341909fb315fad6e9a471b90a7891/docs/_snowpack/pkg/pixi-live2d-display.js

```
Live2DMotion.prototype.updateParam;
Live2DMotion.prototype.updateParam = function(model, entry) {
  originalUpdateParam.call(this, model, entry);
  if (entry.isFinished() && this.onFinishHandler) {
    this.onFinishHandler(this);
    delete this.onFinishHandler
```

