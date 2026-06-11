import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWorldSearch = (props: SvgProps) => (
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
    <Path d="M21 12a9 9 0 1 0 -9 9" />
    <Path d="M3.6 9h16.8" />
    <Path d="M3.6 15h7.9" />
    <Path d="M11.5 3a17 17 0 0 0 0 18" />
    <Path d="M12.5 3a16.984 16.984 0 0 1 2.574 8.62" />
    <Path d="M15 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M20.2 20.2l1.8 1.8" />
  </Svg>
);
export default SvgWorldSearch;
