# browser-sdk

``` sh
npm i @aplazame/browser
```

``` js
import { AplazameIFrame } from '@aplazame/browser'

const aplazameIframe = new AplazameIFrame({
    url: 'https://aplazame.com/app',
    searchParams: {
        publicKey: 'foobar',
    },
})

aplazameIframe
    .mount(document.querySelector('#iframe_container'))
```