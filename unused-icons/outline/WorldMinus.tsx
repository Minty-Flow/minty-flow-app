import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWorldMinus = (props: SvgProps) => (
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
    <Path d="M20.483 15.006a9 9 0 1 0 -7.958 5.978" />
    <Path d="M3.6 9h16.8" />
    <Path d="M3.6 15h16.8" />
    <Path d="M11.5 3a17 17 0 0 0 0 18" />
    <Path d="M12.5 3a16.94 16.94 0 0 1 2.307 12" />
    <Path d="M16 19h6" />
  </Svg>
);
export default SvgWorldMinus;
