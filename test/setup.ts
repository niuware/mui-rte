import 'jsdom-global/register'
import Enzyme from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

Enzyme.configure({adapter: new Adapter()})
const noop = () => {}
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true })
