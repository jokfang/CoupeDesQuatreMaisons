export async function encouragement(message) {
    const listEncouragement = ['courage', 'tu peux', 'c\'est génial', 'bravo', 'gg', 'superbe', 'as besoin d\'aide'];
    for (const motivation of listEncouragement) {
        if (message.toLowerCase().includes(motivation)) {
            return true;
        }
    }
    return false;
}