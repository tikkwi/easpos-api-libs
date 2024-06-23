## Adding As Submodule
 ```bash
 git submodule add git@github.com:tinkokowin96/easpos-api-libs.git libs
 ```

## tsconfig
```JSON 
"typeRoots": ["libs/common/types"],
"paths": {
  "@app/*": ["src/utils/*"],
  "@common/*": ["libs/common/src/*"],
  "@shared/*": ["libs/shared/src/*"]
} 
```

## Common
- For ```schema/dto```, only add core and those that need communication with other apps


## Do
- All service methods' args **must** be ```dto, meta```
- ```newTransaction``` **must** be ```false``` for using same app's service and ```true``` for different app

## Don't 
- Except standalone files that won't have connection with other files (eg. ```constant```),don't aggregate exports with barrel files(```index.ts``` -> ```export * ...```) which can raise tan of unexpected errors and circular dependencies which is very hard to trace..

## NOTE
- ### Difference between ```common/shared``` and ```shared lib```
  - Both services available through multiple apps 
  - Services in ```shared lib``` don't need to communicate outside world (services not available in ```shared lib```)
  - Which mean dependency injection won't be the same 
  - If dependency lie within the app, can provide simply with ```import```.
  - Unless it would be communicate through ```transport layer``` (```grpc```) and providing dependency would be different
  - ```common/shared``` is the place for shared services that need external communications  
  - External dependencies **must** be abstracted in ```common/shared```
- ### Cautions about ```Request Scope Service```
  - While ```Request Scope Service``` provide convenient way to maintain request-specific instance, it raise tons of challenges
  - ```Default Scope Service``` create only only once and by the time they are create ```Request Scope Dependencies``` are ```undefined``` and as ```Default Scope Service``` won't re-create instance, these will be ```undefined``` forever
  - So we'll have to use run-time dep resolver like ```ModuleRef``` every time we need throughout the service
  - So, we should avoid ```Request Scope``` as much as we can and should handle ```Request``` specific state with ```Interceptor```.
