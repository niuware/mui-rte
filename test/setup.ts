import 'jsdom-global/register'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({adapter: new Adapter()})
const noop = () => {}
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true })
