import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandCloudflare = (props: SvgProps) => (
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
    <Path d="M13.031 7.007c2.469 -.007 3.295 1.293 3.969 2.993c4 0 4.994 3.825 5 6h-20c-.001 -1.64 1.36 -2.954 3 -3c0 -1.5 1 -3 3 -3c.66 -1.942 2.562 -2.986 5.031 -2.993" />
    <Path d="M12 13h6" />
    <Path d="M17 10l-2.5 6" />
  </Svg>
);
export default SvgBrandCloudflare;
