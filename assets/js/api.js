export const API = {
    accessPoint: "https://api.edamam.com/api/recipes/v2",
    application_ID: "28de1a66",
    key: "85d45c4eb4003d8f3ae4c23e42a2d87a",
    type: "public",
    fetch: async function(queries, successCallback){

        const query = queries?.join("&")
        .replace(/,/g, "=")
        .replace(/ /g, "%20")
        .replace(/\+/g, "%2B");
    
        const requestUrl = `${API.accessPoint}?app_id=${API.application_ID}&app_key=${API.key}&type=${API.type}${query ? ("&" + query) :""}`;
        
        const response = await fetch(requestUrl);
        
        if(response.ok){
            const data = await response.json();
            successCallback(data);
        }
    },
    default_queries: [
        ["field", "uri"],
        ["field", "label"],
        ["field", "image"],
        ["field", "totalTime"]
    ],
}