import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import { BiCreditCard, BiLabel } from 'react-icons/bi';
import { BsCardImage } from 'react-icons/bs';
import { GrAttachment } from 'react-icons/gr';
import { ImParagraphLeft } from 'react-icons/im';
import { IoCloseOutline, IoPersonOutline } from 'react-icons/io5';
import { MdDateRange } from 'react-icons/md';
import { VscChecklist } from 'react-icons/vsc';
import ReactModal from 'react-modal';
import { CardStatusType, itemType } from '../types';

interface CardProps {
    item: itemType;
    cardStatus: CardStatusType;
}

const modalStyles = {
    overlay: {
        backgroundColor: 'rgb(0 0 0 / 75%)',
    },
    content: {
        top: '50px',
        left: '20%',
        right: '20%',
        bottom: '50px',
        backgroundColor: '#f4f5f7',
        padding: '10px',
    },
};

const initialState: itemType = {
    _id: '',
    title: '',
    description: '',
    status: '',
};

type ACTIONTYPE =
    | { type: 'setTitle'; value: string }
    | { type: 'setDescription'; value: string }
    | { type: 'setItemInput'; value: itemType };

const inputReducer = (state: typeof initialState, action: ACTIONTYPE) => {
    switch (action.type) {
        case 'setTitle':
            return { ...state, title: action.value };
        case 'setDescription':
            return { ...state, description: action.value };
        case 'setItemInput':
            return action.value;
        default:
            return state;
    }
};

const Card = ({ item, cardStatus }: CardProps) => {
    const descFieldRef = useRef<HTMLTextAreaElement>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [descEdit, setDescEdit] = useState(false);
    const [itemInput, dispatch] = useReducer(inputReducer, initialState);

    useEffect(() => {
        dispatch({ type: 'setItemInput', value: item });
    }, [item]);

    useEffect(() => {
        if (descEdit) {
            descFieldRef.current?.focus();
        }
    }, [descEdit]);

    const [{ opacity }, dragRef] = useDrag(
        {
            type: 'div',
            item: { _id: item._id },
            collect: (monitor) => ({
                opacity: monitor.isDragging() ? 0.5 : 1,
            }),
            end: () => {
                console.log(item._id);
            },
        },
        []
    );

    const closeModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        setModalOpen(false);
    };

    const titleChangedAndSave = () => {
        console.log(itemInput);
    };

    const descChangedAndSave = () => {
        console.log(itemInput);
    };

    return (
        <div
            ref={dragRef}
            className="w-full bg-white h-12 flex-shrink-0 px-3 text-sm rounded shadow cursor-pointer"
            style={{ opacity }}
            onClick={() => setModalOpen(true)}
            role="presentation"
        >
            <div className="flex py-1 items-center space-x-2">
                <div
                    className={`w-8 h-1 rounded-full ${cardStatus === 'todo'
                            ? 'bg-blue-600'
                            : cardStatus === 'doing'
                                ? 'bg-yellow-400'
                                : cardStatus === 'done' && 'bg-green-600'
                        }`}
                >
                    {' '}
                </div>
            </div>
            <p className="w-full truncate">{item?.title}</p>
            <ReactModal
                isOpen={modalOpen}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
                style={modalStyles}
            >
                <div className="w-full p-2 text-gray-700">
                    <div className="w-full flex items-center space-x-4">
                        <div className="flex-1 flex items-center space-x-3 text-xl">
                            <div>
                                <BiCreditCard />
                            </div>
                            <input
                                type="text"
                                value={itemInput?.title}
                                onChange={(e) =>
                                    dispatch({ type: 'setTitle', value: e.target.value })
                                }
                                onBlur={titleChangedAndSave}
                                className="w-full bg-transparent font-bold focus:outline-none focus:bg-white rounded px-2 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 font-bold text-xl hover:bg-gray-300 rounded-full cursor-pointer"
                        >
                            <IoCloseOutline />
                        </button>
                    </div>
                    <div className="w-full flex space-x-3 mt-3">
                        <div className="flex-1 ">
                            <div className="w-full flex items-center space-x-3 text-lg">
                                <div>
                                    <ImParagraphLeft />
                                </div>
                                <p className="bg-transparent text-sm font-semibold outline-none focus:bg-white rounded px-2 focus:ring-2 focus:ring-blue-500">
                                    Description
                                </p>
                                {itemInput?.description !== '' ? (
                                    <button
                                        onClick={() => setDescEdit(true)}
                                        type="button"
                                        className="h-8 px-2 bg-gray-200 hover:bg-gray-300 text-sm rounded"
                                    >
                                        Edit
                                    </button>
                                ) : null}
                            </div>
                            <div className="w-full mt-3 pl-10">
                                <textarea
                                    ref={descFieldRef}
                                    id="description"
                                    name="description"
                                    className="w-full bg-gray-200 focus:bg-white rounded p-1 px-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    value={itemInput?.description}
                                    onClick={() => setDescEdit(true)}
                                    onChange={(e) =>
                                        dispatch({ type: 'setDescription', value: e.target.value })
                                    }
                                >
                                    {' '}
                                </textarea>
                                {descEdit && (
                                    <div className="flex items-center mt-2 space-x-2">
                                        <button
                                            type="button"
                                            className="w-12 h-8 rounded flex text-sm text-white items-center justify-center font-semibold bg-blue-500 hover:bg-blue-600 shadow"
                                            onClick={() => {
                                                descChangedAndSave();
                                                setDescEdit(false);
                                            }}
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setDescEdit(false)}
                                            type="button"
                                            className="w-8 h-8 rounded flex items-center text-2xl justify-center font-bold hover:text-gray-800"
                                        >
                                            <IoCloseOutline />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-44">
                            <p className="text-sm uppercase mb-3">ADD TO CARD</p>
                            <div className="w-ful flex flex-col space-y-2 text-sm">
                                <button
                                    type="button"
                                    className="h-8 rounded bg-gray-200 flex items-center space-x-2 px-2 hover:bg-gray-300"
                                >
                                    <IoPersonOutline />
                                    <span>Members</span>
                                </button>
                                <button
                                    type="button"
                                    className="h-8 rounded bg-gray-200 flex items-center space-x-2 px-2 hover:bg-gray-300"
                                >
                                    <BiLabel />
                                    <span>Labels</span>
                                </button>
                                <button
                                    type="button"
                                    className="h-8 rounded bg-gray-200 flex items-center space-x-2 px-2 hover:bg-gray-300"
                                >
                                    <VscChecklist />
                                    <span>Checklist</span>
                                </button>
                                <button
                                    type="button"
                                    className="h-8 rounded bg-gray-200 flex items-center space-x-2 px-2 hover:bg-gray-300"
                                >
                                    <MdDateRange />
                                    <span>Date</span>
                                </button>
                                <button
                                    type="button"
                                    className="h-8 rounded bg-gray-200 flex items-center space-x-2 px-2 hover:bg-gray-300"
                                >
                                    <GrAttachment />
                                    <span>Attachments</span>
                                </button>
                                <button
                                    type="button"
                                    className="h-8 rounded bg-gray-200 flex items-center space-x-2 px-2 hover:bg-gray-300"
                                >
                                    <BsCardImage />
                                    <span>Cover</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </ReactModal>
        </div>
    );
};

export default Card;