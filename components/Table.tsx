import {Product} from "@stripe/firestore-stripe-payments";
import {CheckIcon} from "@heroicons/react/outline";

interface Props {
    plans: Product[]
    selectedPlan: Product
}

const Table = ({plans, selectedPlan}: Props) => {
    return (
        <table>
            <tbody className={`divide-y divide-[grey]`}>
            <tr className={`tableRow`}>
                <td className={`tableDataTitle`}>Monthly price</td>
                {plans?.map(({id, prices}) => (
                    <td key={id}
                        className={`tableDataFeature ${selectedPlan.id === id ? "text-[#e50914]" : "text-[grey]"}`}
                    >EUR{prices[0].unit_amount! / 100}</td>
                ))}
            </tr>
            <tr className={`tableRow`}>
                <td className={`tableDataTitle`}>Video quality</td>
                {plans?.map(({id, metadata}) => (
                    <td key={id}
                        className={`tableDataFeature ${selectedPlan.id === id ? "text-[#e50914]" : "text-[grey]"}`}
                    >{metadata.videoQuality}</td>
                ))}
            </tr>

            <tr className={`tableRow`}>
                <td className={`tableDataTitle`}>Resolution</td>
                {plans?.map(({id, metadata}) => (
                    <td key={id}
                        className={`tableDataFeature ${selectedPlan.id === id ? "text-[#e50914]" : "text-[grey]"}`}
                    >{metadata.resolution}</td>
                ))}
            </tr>

            <tr className={`tableRow`}>
                <td className={`tableDataTitle`}>Watch on you TV, computer, mobile phone, and table</td>
                {plans?.map(({id, metadata}) => (
                    <td key={id}
                        className={`tableDataFeature ${selectedPlan.id === id ? "text-[#e50914]" : "text-[grey]"}`}
                    >{metadata.portability && (<CheckIcon className={`inline-block h-8 w-8`}/>)}</td>
                ))}
            </tr>
            </tbody>
        </table>
    );
};

export default Table;