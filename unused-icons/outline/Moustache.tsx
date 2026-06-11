import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMoustache = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M15 9a3 3 0 0 1 2.599 1.5c.933 1.333 2.133 1.556 3.126 1.556l.291 0l.77 -.044l.213 0c-.963 1.926 -3.163 2.925 -6.6 3l-.4 0l-.165 0a3 3 0 0 1 .165 -6l.001 -.012" />
    <Path d="M9 9a3 3 0 0 0 -2.599 1.5c-.933 1.333 -2.133 1.556 -3.126 1.556l-.291 0l-.77 -.044l-.213 0c.963 1.926 3.163 2.925 6.6 3l.4 0l.165 0a3 3 0 0 0 -.165 -6l-.001 -.012" />
  </Svg>
);
export default SvgMoustache;
