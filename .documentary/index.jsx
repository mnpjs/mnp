/**
 * The footer for documentation.
 */
export const footer = () => {
  const alt = '{{ org }}'
  const src = 'https://avatars3.githubusercontent.com/u/38815725?v=4&s=100'
  const href = '{{ website }}'
  const org = '{{ trademark }}'
  const year = new Date().getFullYear()
  return [
    (<table>
      <tr>
        <td>
          <img src={src} alt={alt} />
        </td>
        <td>
          © <a href={href}>{org}</a> {year}
        </td>
      </tr>
    </table>),
  ]
}