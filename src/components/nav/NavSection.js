import NavItem from './NavItem';
import NavHead from './NavHead';
import { List } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import NavCollapse from './NavCollapse';

export default function NavSection({ menu, collapsemen, navmen, onUpNavCol, onUpNavMenu }) {
  const onClickNavHead = (item) => {
    onUpNavCol(item);
  };

  return (
    <List>
      {menu.map((item) => {
        return (
          <div key={`div-${item.key}`}>
            <NavHead
              key={item.key}
              keyhead={item.key}
              text={item.text}
              icon={item.icon}
              upNav={onClickNavHead}
              curstate={collapsemen}
            />
            {/* <Collapse in={false} timeout="auto" unmountOnExit>
              <List>
                {item.children.map((child) => {
                  return <NavItem key={child.key} keynav={child.key} text={child.text} url={child.url} />;
                })}
              </List>
            </Collapse> */}
            <NavCollapse parent={item.key} curstate={collapsemen}>
              <List>
                {item.children.map((child) => {
                  return (
                    <NavItem
                      key={child.key}
                      keynav={child.key}
                      text={child.text}
                      url={child.url}
                      upNavMenu={onUpNavMenu}
                      curstate={navmen}
                    />
                  );
                })}
              </List>
            </NavCollapse>
          </div>
        );
      })}
    </List>
  );
}
