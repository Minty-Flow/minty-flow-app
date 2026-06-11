import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFileDigit = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M12 2l.117 .007a1 1 0 0 1 .876 .876l.007 .117v4l.005 .15a2 2 0 0 0 1.838 1.844l.157 .006h4l.117 .007a1 1 0 0 1 .876 .876l.007 .117v9a3 3 0 0 1 -2.824 2.995l-.176 .005h-10a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005zm-1 9h-1a2 2 0 0 0 -2 2v3a2 2 0 0 0 2 2h1a2 2 0 0 0 2 -2v-3a2 2 0 0 0 -2 -2m4 0a1 1 0 0 0 -1 1v5a1 1 0 0 0 2 0v-5a1 1 0 0 0 -1 -1m-4 2v3h-1v-3z" />
    <Path d="M19 7h-4l-.001 -4.001z" />
  </Svg>
);
export default SvgFileDigit;
