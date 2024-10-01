const DokoReverseProxyName = 'DokoReverseProxyName'

// 获取类的所有属性，包括自身和原型上的属性
function getAllProperties(cls) {
  const properties = new Set()

  // 获取自身属性
  const ownProps = Object.getOwnPropertyNames(cls)
  ownProps.forEach(prop => properties.add(prop))

  // 获取构造函数（如果有）
  if (cls.constructor) {
    properties.add('constructor')
  }
  /*let proto = Object.getPrototypeOf(cls);
  while (proto) {
    const protoProps = Object.getOwnPropertyNames(proto);
    protoProps.forEach(prop => properties.add(prop));
    proto = Object.getPrototypeOf(proto);
  }*/

  return Array.from(properties)
}

function doke(classt) {
  // 保存原有的 hello 方法
  // 替换 hello 方法
  // target.hello = function() {
  //   // 调用 doClass 的 hello 方法
  //   doClass.hello();
  // };
  return (target) => {
    const staticProps = getAllProperties(classt)
    if (classt['DokoReverseProxyName']) {
      classt['DokoReverseProxyName'].push(target.name)
    } else {
      Object.defineProperty(classt, 'DokoReverseProxyName', {
        configurable: false,
        enumerable: false,
        value: [target.name],
        writable: false
      })
    }
    for (const staticProp of staticProps) {
      if (!['length', 'name', 'prototype'].includes(staticProp)) {
        if (target[staticProp]) {
          console.log(staticProp)
          classt[staticProp] = target[staticProp]
        }
      }
    }
  }
}

class BeClass {
  static hello() {
    console.log('BeClass')
  }

  constructor() {
    console.log('new beclass')
  }
}

@doke(BeClass)
class doClass {
  static hello() {
    console.log('doClass')
  }
  constructor() {
    console.log('new doClass')
  }
}

console.log(BeClass.constructor.name)
// 调用 BeClass 的 hello 方法
new BeClass() // 输出: "doClass"
