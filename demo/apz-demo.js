
import { AplazameIFrame } from '../src/index'

const formEl = document.querySelector('form')

formEl.addEventListener('submit', (e) => {
    e.preventDefault()

    const checkoutId = formEl.elements.checkoutId?.value || null
    const publicKey = formEl.elements.publicKey?.value || import.meta.env.APZ_PK || 'your_public_key'
    
    console.log('submit', {
        checkoutId,
        publicKey,
    })

    if (!checkoutId) return

    const apzIframe = new AplazameIFrame({
        url: 'https://checkout.aplazame.com',
        searchParams: {
            public_key: publicKey,
            order: checkoutId,
        },
    })

    apzIframe
        .setStyles('fill_absolute')
        .on('close', (...args) => {
            console.log('close', args)
            
            apzIframe.unmount()
        })

        apzIframe
        .mount(document.body)
})
