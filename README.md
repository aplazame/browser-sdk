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

### AplazameIFrame object

> constructor

``` js
const apzIframe = new AplazameIFrame({
    url,
    searchParams,
})
```

> methods

``` ts
apzIframe.send(event: string, payload: unknown)
// received by the iframe as MessageEvent<{ data: { event, payload } }>

apzIframe.request(request: string, payload: unknown)
// received by the iframe as MessageEvent<{ data: { request, payload } }>

apzIframe.mount(el: HTMLElement)
// iframe is created and attached to el when calling this method

apzIframe.setStyles(styles: string | { [key: string]: string })
// applies styles to iframe DOM Element
// when styles is a string, it refers to a preset
// otherwise applies styles key by key

apzIframe.addStylesPreset(name: string, styles: { [key: string]: string })
// Adds a new preset to presets

apzIframe.resetStyles()
// clears all styles applied to the iframe

apzIframe.unmount()
// removes iframe from DOM tree and emits 'unmount' event
```

> default styles presets

``` js
const defaulsIframeStylesPresets: {
  fill_fixed: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    border: 'none',
  },
  fill_absolute: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    border: 'none',
  },
}
```