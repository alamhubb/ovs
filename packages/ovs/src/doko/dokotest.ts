import { Doko } from '@/doko/doko'

class BeClass{
  static hello() {
    console.log('BeClass')
  }
}

@Doko(BeClass)
class doClass {
  static hello() {
    console.log('doClass')
  }
}

BeClass.hello()
