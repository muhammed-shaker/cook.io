
const API = {
    accessPoint: "https://api.edamam.com/api/recipes/v2",
    applicationId: "28de1a66",
    key: "85d45c4eb4003d8f3ae4c23e42a2d87a",
    type: "public",
}

export const fetchData = async function(queries, callback){
    const query = queries?.join("&")
    .replace(/,/g, "=")
    .replace(/ /g, "%20")
    .replace(/\+/g, "%2B");

    const requestUrl = `${API.accessPoint}?app_id=${API.applicationId}&app_key=${API.key}&type=${API.type}${query ? ("&" + query) : ""}`;

    const response = await fetch(requestUrl);
    
    if(response.ok){
        const data = await response.json();
        callback(data);
    }
}