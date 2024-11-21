import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const getToday = () => {
    return daysOfWeek[new Date().getDay()]
}

const getHour = () => {
    let hour = new Date().getHours()
    if (hour === 0) {
        return 12
    }
    if (hour > 12) {
        hour -= 12
    }
    return hour
}

const getMinute = () => {
    return new Date().getMinutes()
}

const getAmPm = () => {
    if (new Date().getHours() > 11) {
        return 'PM'
    }
    return 'AM'
}

const requestOpenEats = async (day, time) => {
    const response = await fetch('http://192.168.50.79:3460/open', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day, time }),
    })
    const body = await response.json()
    return body
}

const NavBar = () => {
    const [day, setDay] = useState(getToday())
    const [hour, setHour] = useState(getHour())
    const [minute, setMinute] = useState(getMinute())
    const [ampm, setAmPm] = useState(getAmPm())
    const [results, setResults] = useState([])

    useEffect(() => {
        (async () => {
            try {
                const response = await requestOpenEats(day, `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`)
                setResults(response);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        })();
    }, [day, hour, minute, ampm])
    return (
        <div className="w-full flex items-center flex-col h-screen">
            <div className="flex-row items-center text-3xl">
                <div className="w-full h-20 flex text-white">
                    <ul className="flex flex-row my-5">
                        <li className="">
                            <Menu>
                                <MenuButton className="bg-blue-500 px-2 border-2 w-44">{day}</MenuButton>
                                <MenuItems anchor="bottom" className="bg-opacity-100 bg-blue-500 border-2 w-44">
                                    {daysOfWeek.map((day, idx) => {
                                        return (<MenuItem>
                                            <div className="block data-[focus]:bg-blue-100 text-white text-3xl px-2" key={idx} onClick={() => {
                                                setDay(day)
                                            }}>
                                                {day}
                                            </div>
                                        </MenuItem>)
                                    })}
                                </MenuItems>
                            </Menu>
                        </li>
                        <div>&nbsp;</div>
                        <li className="">
                            <Menu>
                                <MenuButton className="bg-blue-500 px-1 border-2 text-right w-12">{hour}</MenuButton>
                                <MenuItems anchor="bottom" className="bg-opacity-100 bg-blue-500 border-2 w-12 px-1">
                                    {['1', '2', '3', '4', '5', '6', '7', '8', ' 9', '10', '11', '12'].map((hour, idx) => {
                                        return (<MenuItem>
                                            <div className="block data-[focus]:bg-blue-100 text-white text-3xl text-right" key={idx} onClick={() => {
                                                setHour(hour)
                                            }}>
                                                {hour}
                                            </div>
                                        </MenuItem>)
                                    })}
                                </MenuItems>
                            </Menu>

                        </li>
                        <div>:</div>
                        <li className="">
                            <Menu>
                                <MenuButton className="bg-blue-500 px-1 border-2">{minute.toString().padStart(2, '0')}</MenuButton>
                                <MenuItems anchor="bottom" className="bg-opacity-100 bg-blue-500 border-2">
                                    {['00', '10', '20', '30', '40', '50'].map((minute, idx) => {
                                        return (<MenuItem>
                                            <div className="block data-[focus]:bg-blue-100 text-white text-3xl px-2" key={idx} onClick={() => {
                                                setMinute(minute)
                                            }}>
                                                {minute}
                                            </div>
                                        </MenuItem>)
                                    })}
                                </MenuItems>
                            </Menu>

                        </li>
                        <div>&nbsp;</div>
                        <li>
                            <Menu>
                                <MenuButton className="bg-blue-500 px-1 border-2">{ampm}</MenuButton>
                                <MenuItems anchor="bottom" className="bg-opacity-100 bg-blue-500 border-2">
                                    {ampm === 'PM' &&
                                        <MenuItem>
                                            <div className="block data-[focus]:bg-blue-100 text-white text-3xl px-1" href="/settings" onClick={() => {
                                                setAmPm('AM')
                                            }}>
                                                AM
                                            </div>
                                        </MenuItem>
                                    }
                                    {ampm === 'AM' &&
                                        <MenuItem>
                                            <div className="block data-[focus]:bg-blue-100 text-white text-3xl px-1" onClick={() => {
                                                setAmPm('PM')
                                            }}>
                                                PM
                                            </div>
                                        </MenuItem>
                                    }
                                </MenuItems>
                            </Menu>
                        </li>
                    </ul>

                </div>
            </div>
            <div>
                <div className="text-[#2147BA] bg-white  max-h-[calc(100vh-130px)] overflow-y-auto mb-5">
                    {results.map((restaurant) => {

                        return (<div className="group hover:w-400 hover:bg-blue-100 flex-row py-1 px-4 w-80"><div className="group-hover: test-lg">{restaurant.name}</div><span className="hidden group-hover:block text-right group-hover:text-lg">closes at {restaurant.closes}</span></div>)
                    })}
                </div>
            </div>
        </div>

    )
}

export default NavBar