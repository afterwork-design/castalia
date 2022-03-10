export interface LayoutPage<T = {}> extends React.FC<T> {
    getLayout?: (page: JSX.Element) => JSX.Element;
}
