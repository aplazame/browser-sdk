# browser-sdk

``` sh
npm i @aplazame/browser
```

``` js
import { AplazameIFrame } from '@aplazame/browser'

const apzIframe = new AplazameIFrame({
    url: 'https://aplazame.com/app',
    searchParams: {
        publicKey: 'foobar',
    },
})

apzIframe
    .mount(document.querySelector('#iframe_container'))

apzIframe
    .on('status', e => {
        console.log('status received from iframe:')
        console.log('details', e.details)
    })

function onSubmit () {
    apzIframe.request('submit')
}
```