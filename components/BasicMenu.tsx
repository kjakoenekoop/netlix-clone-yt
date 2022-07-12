import {Button, Menu, MenuItem} from "@mui/material";
import React, {useState} from "react";

const BasicMenu = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)


    return (
        <div className={`md:!hidden`}>
            <Button id={`basic-button`}
                    aria-controls={open ? `basic-menu` : undefined}
                    aria-haspopup={`true`}
                    aria-expanded={open ? `true` : undefined}
                    onClick={handleClick}
                    className={`!capitalize !text-white`}
            >
                Browse
            </Button>

            <Menu open={open}
                  id={`basic-menu`}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  className={`menu`}
                  MenuListProps={{'aria-labelledby': `basic-button`}}
            >
                <MenuItem onClick={handleClose}>Home</MenuItem>
                <MenuItem onClick={handleClose}>TV Shows</MenuItem>
                <MenuItem onClick={handleClose}>Movies</MenuItem>
                <MenuItem onClick={handleClose}>New & Popular</MenuItem>
                <MenuItem onClick={handleClose}>My List</MenuItem>
            </Menu>
        </div>
    );
};

export default BasicMenu;