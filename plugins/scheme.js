const stageColor = (stage) => {
  let color
  switch (stage) {
    case 1:
      color = '7777ff'
      break
    case 2:
      color = '77ffff'
      break
    case 3:
      color = '77ff77'
      break
    case 4:
      color = 'ffff77'
      break
    case 5:
      color = 'ff7777'
      break
  }
  return color
}

export default ({ app }, inject) => {
  inject('stageColor', stage => stageColor(stage))
}
