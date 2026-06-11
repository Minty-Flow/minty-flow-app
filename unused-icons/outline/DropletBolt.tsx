import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDropletBolt = (props: SvgProps) => (
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
    <Path d="M18.628 12.076a6.653 6.653 0 0 0 -.564 -1.199l-4.89 -7.26c-.42 -.625 -1.287 -.803 -1.936 -.397a1.376 1.376 0 0 0 -.41 .397l-4.893 7.26c-1.695 2.838 -1.035 6.441 1.567 8.546c1.7 1.375 3.906 1.852 5.958 1.431" />
    <Path d="M19 16l-2 3h4l-2 3" />
  </Svg>
);
export default SvgDropletBolt;
