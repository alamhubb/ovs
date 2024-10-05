const DokoReverseProxyName = 'DokoReverseProxyName'

// 获取类的所有属性，包括自身和原型上的属性
function getAllProperties(cls) {
  const properties = new Set()

  // 获取自身属性
  const ownProps = Object.getOwnPropertyNames(cls)
  ownProps.forEach(prop => properties.add(prop))

  // 获取构造函数（如果有）
  /*if (cls.constructor) {
    properties.add('constructor')
  }*/
  /*let proto = Object.getPrototypeOf(cls);
  while (proto) {
    const protoProps = Object.getOwnPropertyNames(proto);
    protoProps.forEach(prop => properties.add(prop));
    proto = Object.getPrototypeOf(proto);
  }*/

  return Array.from(properties)
}


export function dokoFun(target, classt) {
  console.log('zhixingle1111')
  const staticProps = getAllProperties(target)
  if (target['DokoReverseProxyName']) {
    target['DokoReverseProxyName'].push(classt.name)
  } else {
    Object.defineProperty(target, 'DokoReverseProxyName', {
      configurable: false,
      enumerable: false,
      value: [classt.name],
      writable: false
    })
  }
  let dokoObj = {}
  for (const staticProp of staticProps) {
    if (!['length', 'name', 'prototype'].includes(staticProp)) {
      //应该修改get和set，set同步设置，get同步获取
      if (classt[staticProp]) {
        console.log(staticProp)
        dokoObj[staticProp] = target[staticProp]
        target[staticProp] = classt[staticProp]
      }
    }
  }
  Object.defineProperty(classt, 'dokoObj', {
    configurable: false,
    enumerable: false,
    value: dokoObj,
    writable: false
  })
}
// Dokodemo Door
export function Doko(target) {
  // 保存原有的 hello 方法
  // 替换 hello 方法
  // target.hello = function() {
  //   // 调用 doClass 的 hello 方法
  //   doClass.hello();
  // };
  return (classt) => {
    dokoFun(target, classt)
  }
}
