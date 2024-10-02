import { doke } from '@/doko/doko'

class BeClass{
  static hello() {
    console.log('BeClass')
  }
}

@doke(BeClass)
class doClass {
  static hello() {
    console.log('doClass')
  }
}

BeClass.hello()
