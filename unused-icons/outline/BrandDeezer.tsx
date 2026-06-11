import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandDeezer = (props: SvgProps) => (
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
    <Path d="M3 16.5h2v.5h-2l0 -.5" />
    <Path d="M8 16.5h2.5v.5h-2.5l0 -.5" />
    <Path d="M16 17h-2.5v-.5h2.5l0 .5" />
    <Path d="M21.5 17h-2.5v-.5h2.5l0 .5" />
    <Path d="M21.5 13h-2.5v.5h2.5l0 -.5" />
    <Path d="M21.5 9.5h-2.5v.5h2.5l0 -.5" />
    <Path d="M21.5 6h-2.5v.5h2.5l0 -.5" />
    <Path d="M16 13h-2.5v.5h2.5l0 -.5" />
    <Path d="M8 13.5h2.5v-.5h-2.5l0 .5" />
    <Path d="M8 9.5h2.5v.5h-2.5l0 -.5" />
  </Svg>
);
export default SvgBrandDeezer;
