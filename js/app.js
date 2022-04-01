if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js', {scope: './'})
    .then((reg) => console.log("service workers registered", reg))
    .catch((err) => console.log('service workers not registered', err))
}