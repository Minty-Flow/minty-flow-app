import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTie = (props: SvgProps) => (
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
    <Path d="M12 22l4 -4l-2.5 -11l.993 -2.649a1 1 0 0 0 -.936 -1.351h-3.114a1 1 0 0 0 -.936 1.351l.993 2.649l-2.5 11l4 4" />
    <Path d="M10.5 7h3l5 5.5" />
  </Svg>
);
export default SvgTie;
