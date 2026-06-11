import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWebhook = (props: SvgProps) => (
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
    <Path d="M4.876 13.61a4 4 0 1 0 6.124 3.39h6" />
    <Path d="M15.066 20.502a4 4 0 1 0 1.934 -7.502c-.706 0 -1.424 .179 -2 .5l-3 -5.5" />
    <Path d="M16 8a4 4 0 1 0 -8 0c0 1.506 .77 2.818 2 3.5l-3 5.5" />
  </Svg>
);
export default SvgWebhook;
