class A {
  constructor() {
    console.log('Original A constructor');
  }
}

// 重写构造函数
A.prototype.constructor = function() {
  console.log('Overridden A constructor');
};


new A()
