import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAdjustmentsCog = (props: SvgProps) => (
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
    <Path d="M4 10a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <Path d="M6 4v4" />
    <Path d="M6 12v8" />
    <Path d="M13.199 14.399a2 2 0 1 0 -1.199 3.601" />
    <Path d="M12 4v10" />
    <Path d="M12 18v2" />
    <Path d="M16 7a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <Path d="M18 4v1" />
    <Path d="M18 9v2.5" />
    <Path d="M17.001 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M19.001 15.5v1.5" />
    <Path d="M19.001 21v1.5" />
    <Path d="M22.032 17.25l-1.299 .75" />
    <Path d="M17.27 20l-1.3 .75" />
    <Path d="M15.97 17.25l1.3 .75" />
    <Path d="M20.733 20l1.3 .75" />
  </Svg>
);
export default SvgAdjustmentsCog;
