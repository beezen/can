import Loadable from 'react-loadable';
import Loading from 'components/loading';

/**
 * 组件分割
 * @param Component - 组件
 * */
export default Component => Loadable({
    loader: Component,
    loading: Loading,
    delay: 200,
    timeout: 10000
})
