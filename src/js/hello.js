class Hello {
    constructor(config) {
        console.log('sdsdsdsd', this.target);
        this.target = config.target;
    }

    run() {
        this.target.innerHTML = `
            <p>
                Hello from ES2015
            </p>
        `;
    }
}

export default Hello
