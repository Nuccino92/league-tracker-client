export default function getInitials(teamName: string) {
  const words = teamName.split(" ");

  const initials = words.map((word) => word.charAt(0).toUpperCase());

  return initials.join("");
}
