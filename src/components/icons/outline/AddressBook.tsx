import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgAddressBook = (props: SvgProps) => (
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
    <Path d="M20 6v12a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2" />
    <Path d="M10 16h6" />
    <Path d="M11 11a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M4 8h3" />
    <Path d="M4 12h3" />
    <Path d="M4 16h3" />
  </Svg>
)
export default SvgAddressBook
