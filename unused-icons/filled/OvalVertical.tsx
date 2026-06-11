import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgOvalVertical = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M12 5c-5.457 0 -10 3.028 -10 7s4.543 7 10 7s10 -3.028 10 -7s-4.543 -7 -10 -7z" />
  </Svg>
);
export default SvgOvalVertical;
