import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgForbid = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-7.387 4.87a1 1 0 0 0 -1.32 1.497l6 6l.094 .083a1 1 0 0 0 1.32 -1.497l-6 -6z" />
  </Svg>
);
export default SvgForbid;
