document.body.appendChild((() => {
  const element = document.createElement('div')
  element.innerHTML = 'Hello World!'
  return element
})())