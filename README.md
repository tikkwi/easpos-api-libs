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
- For ```schema/dto```, only add core and those that will transfer to other apps
