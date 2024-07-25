export default class ChangeOutputPlugin {
  apply(hooks) {
    hooks.emitFile.tap("ChangeOutputFile",(context)=>{
        context.changeOutputPath('./dist/bundle.js');
    });
  }
}
