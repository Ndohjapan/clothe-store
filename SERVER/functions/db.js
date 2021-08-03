const FireStore = require("@google-cloud/firestore");
const path = require("path");

class fireStoreClient {
    constructor() {
        this.fireStore = new FireStore({
            projectId: "learning-317603",
            keyFilename: path.join(__dirname, "./service.json")
        });
    };

    async save(colname, id, data) {
        const docref = this.fireStore.collection(colname).doc(id);
        return await docref.set(data);
    };

    async add(colname, data) {
        const docref = this.fireStore.collection(colname).add(data);
        return await docref;
    };
    async saveSubCollection(rootColname, rootDoc, subCol, subDocData) {
        const docref = this.fireStore.collection(rootColname).doc(rootDoc).collection(subCol).doc(subDocData.doc_name);
        await docref.set(subDocData);
    };
    async saveByPath(path, data) {
        const docref = this.fireStore.doc(path);
        await docref.set(data)
    }
    async get(colname) {
        const docref = await this.fireStore.collection(colname).orderBy("date", "desc").get();
        return docref
    }
    async getOrderBy(colname, query) {
        const docref = await this.fireStore.collection(colname).orderBy(query).get();
        return docref
    }
    async get_with_limit(colname, query) {
        let data;
        let products = [];
        const docref = await this.fireStore.collection(colname).orderBy(query).limit(5).get();
        docref.forEach((doc) => {
            data = doc.data()
            data.id = doc.id
            products.push(data)
        });
        return products
    }
    async delete(colname, id) {
        const doc = await this.fireStore.collection(colname).doc(id).delete();
        return doc;
    }
    async update(colname, id, data) {
        const doc = await this.fireStore.collection(colname).doc(id).update(data);
        return doc;
    }
    async array_contains(colname, queryName, queryValue) {
        const doc = await this.fireStore.collection(colname).where(queryName, "==", queryValue).get();
        return doc;
    }
    async get_equal(colname, queryName, queryValue) {
        const docref = await this.fireStore.collection(colname).where(queryName, "==", queryValue).get();
        return docref
    }
    async findById(colname, ids) {
        const reads = await this.fireStore.collection(colname).doc(ids).get();
        return reads;
    }
    async col_ids(colname, ids) {
        const reads = ids.mao(id => this.fireStore.collection(colname).doc(id).get());
        const result = Promise.all(reads);
        return result.map(each => each.data());
    }
};

module.exports = new fireStoreClient();